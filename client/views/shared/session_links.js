Template.sessionLinks.helpers({
  show: function (template) {
    path = Router.current().route._path;
    if (template === 'sign-in' && path !== '/sign-in' && path !== '/') {
      return true;
    }
    if (template === 'register' && !/register/.exec(path)) {
      return true;
    }
    if (template === 'forgot-password' && path !== '/forgot-password') {
      return true;
    }
  }
});