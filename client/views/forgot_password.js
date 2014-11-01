Template.passwordReset.rendered = function () {
  if (Accounts._resetPasswordToken) {
    Session.set('resetPassword', Accounts._resetPasswordToken);
  }
}

Template.passwordReset.events({
  'submit #new-password' : function(e, t) {
    e.preventDefault();
    var password = $('#new-password-password').val();
    var token = Session.get('resetPassword');
    
    if (! token) {
      return Messages.insert({ content: 'Token is invalid or expired.' });
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
    
    Accounts.resetPassword(Session.get('resetPassword'), password, function (error) {
      if (error) {
        Messages.insert({ content: error.reason })
      } else {
        Session.set('resetPassword', null);
        Messages.insert({ content: 'Your password has been reset.' });
        Router.go('/notes');
      }
    });
      
    return false; 
  }
});

Template.forgotPassword.events({
  'submit #forgot-password-form' : function(e, t) {
    e.preventDefault()
    var email = $('#recovery-email').val().replace(' ','');
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (! email) {
      return Messages.insert({ content: 'Please enter an email address.' });
    }
    
    if (! emailRegex.test(email)) {
      return Messages.insert({ content: 'Invalid email format.' });
    }

    Accounts.forgotPassword({ email: email }, function (error) {
      if (error) {
        Messages.insert({ content: error.reason });
      } else {
        Messages.insert({ content: 'Email has been sent.' });
      }
    });
      
    return false; 
  }
});

