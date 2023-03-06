function checkEmpty(data) {
  return !data || data.trim() === '';
}

function userCredentialsAreValid(email, password){
  return (
    email && email.includes('@') && password && password.trim().length >= 6
  );
}

function userDetailsAreValid(username, nickname, email, password) {
  return (
    userCredentialsAreValid(email, password) &&
    !checkEmpty(username) &&
    !checkEmpty(nickname)
  );
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

module.exports = {
  checkEmpty: checkEmpty,
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed
};