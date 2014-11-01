Template.signIn.events({
  'submit #login-form' : function(e, t){
    e.preventDefault();
    // retrieve the input field values
    var email = t.find('#login-email').value;
    var password = t.find('#login-password').value;

    // Trim and validate your fields here.... 

    // If validation passes, supply the appropriate fields to the
    // Meteor.loginWithPassword() function.
    Meteor.loginWithPassword(email, password, function(error){
      if (error) {
        console.log(error);
        Messages.insert({ content: 'Incorrect email or password' });
        // The user might not have been found, or their passwword
        // could be incorrect. Inform the user that their
        // login attempt has failed. 
      }else{
        Messages.insert({ content: 'Signed in successfully.' });
        Router.go('/notes');
      }
    });
    return false; 
  }
});

Template.register.events({
  'submit #register-form' : function(e, t) {
    e.preventDefault();
    var email = $('#account-email').val().replace(' ','');
    var password = $('#account-password').val();
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (! email) {
      return Messages.insert({ content: 'Please enter an email address.' });
    }
    
    if (! emailRegex.test(email)) {
      return Messages.insert({ content: 'Invalid email format.' });
    }
    
    if (! password) {
      return Messages.insert({ content: 'Please enter a password.' });
    }
    
    if (password.length < 6) {
      return Messages.insert({ content: 'Password must contain at least 6 characters.' });
    }
    
    if (password.length > 48) {
      return Messages.insert({ content: 'Password must contain less than 48 characters.' });
    }

    Accounts.createUser({email: email, password : password}, function(error){
      if (error) {
        Messages.insert({ content: error.reason });
      } else {
        Messages.insert({ content: 'Welcome!' });
        Router.go('/notes');
      }
    });

    return false;
  }
});

Template.sessionLinks.helpers({
  show: function (template) {
    path = Router.current().route._path;
    if (template === 'sign-in' && path !== '/') {
      return true;
    }
    if (template === 'register' && path !== '/register') {
      return true;
    }
    if (template === 'forgot-password' && path !== '/forgot-password') {
      return true;
    }
  }
});