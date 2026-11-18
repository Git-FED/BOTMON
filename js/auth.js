(() => {
  const config = window.BOTMON_AUTH_CONFIG;
  const supabase = window.supabase?.createClient(config.url, config.key);
  const form = document.querySelector('#auth-form');
  const email = document.querySelector('#auth-email');
  const password = document.querySelector('#auth-password');
  const displayName = document.querySelector('#auth-name');
  const submit = document.querySelector('#auth-submit');
  const status = document.querySelector('#auth-status');
  const modeButton = document.querySelector('#auth-mode-toggle');
  const modeLabel = document.querySelector('#auth-mode-label');
  const nameGroup = document.querySelector('#auth-name-group');
  const forgot = document.querySelector('#auth-forgot');
  const userPanel = document.querySelector('#auth-user-panel');
  const formPanel = document.querySelector('#auth-form-panel');
  const accountName = document.querySelector('#account-name');
  const accountEmail = document.querySelector('#account-email');
  const logout = document.querySelector('#auth-logout');
  let signUpMode = false;

  const message = (text, type = 'info') => {
    status.textContent = text;
    status.className = `auth-status ${type}`;
  };
  const clearMessage = () => {
    status.textContent = '';
    status.className = 'auth-status';
  };
  const redirectUrl = () => `${window.location.origin}${window.location.pathname}`;

  const update = (user) => {
    if (user) {
      formPanel.hidden = true;
      userPanel.hidden = false;
      accountEmail.textContent = user.email || '';
      accountName.textContent = user.user_metadata?.display_name || (user.email || 'Operator').split('@')[0];
      return;
    }
    formPanel.hidden = false;
    userPanel.hidden = true;
  };

  const setMode = (signup) => {
    signUpMode = signup;
    document.querySelector('#auth-title').textContent = signup ? 'Create your operator account.' : 'Return to the command deck.';
    document.querySelector('#auth-subtitle').textContent = signup ? 'Save your profile for the future online layer.' : 'Sign in to continue to your account.';
    submit.textContent = signup ? 'Create account' : 'Sign in';
    modeLabel.textContent = signup ? 'Already registered?' : 'New operator?';
    modeButton.textContent = signup ? 'Sign in' : 'Create account';
    nameGroup.hidden = !signup;
    clearMessage();
  };

  const busy = (state) => {
    submit.disabled = state;
    submit.textContent = state ? (signUpMode ? 'Creating…' : 'Signing in…') : (signUpMode ? 'Create account' : 'Sign in');
  };

  modeButton.addEventListener('click', () => setMode(!signUpMode));
  document.querySelector('#auth-back')?.addEventListener('click', () => { window.location.href = 'index.html'; });
  forgot.addEventListener('click', async () => {
    const value = email.value.trim();
    if (!value) return message('Enter your email first, then request a reset link.', 'error');
    const { error } = await supabase.auth.resetPasswordForEmail(value, { redirectTo: redirectUrl() });
    if (error) return message(error.message, 'error');
    message('Password reset instructions sent. Check your inbox.', 'success');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage();
    const value = email.value.trim();
    const secret = password.value;
    if (!value || !secret) return message('Email and password are required.', 'error');
    if (secret.length < 6) return message('Use at least 6 characters for the password.', 'error');
    busy(true);
    try {
      if (signUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email: value,
          password: secret,
          options: { data: { display_name: displayName.value.trim() }, emailRedirectTo: redirectUrl() }
        });
        if (error) throw error;
        if (!data.session) message('Account created. Check your inbox to confirm your email.', 'success');
        else message('Account created. Welcome to the command deck.', 'success');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: value, password: secret });
        if (error) throw error;
        update(data.user);
        message('Signed in successfully.', 'success');
      }
    } catch (error) {
      const text = error.message || 'Authentication failed.';
      message(text.includes('Invalid login credentials') ? 'Invalid email or password.' : text, 'error');
    } finally {
      busy(false);
    }
  });

  logout.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return message(error.message, 'error');
    update(null);
    message('Signed out.', 'success');
  });

  supabase.auth.onAuthStateChange((_event, session) => update(session?.user || null));
  supabase.auth.getSession().then(({ data }) => update(data.session?.user || null));
})();