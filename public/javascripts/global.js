var users = [];

$(document).ready(function () {
  populateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  $('#userList table tbody').on('click', 'td a.linkedituser', populateExistingDetails);
  $('#btnEditUser').on('click', editUser);
});

function populateTable() {

  var tableContent = '';

  $.getJSON('/users/all', function (data) {
    users = data;
    $.each(data, function () {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event) {
  event.preventDefault();
  var username = $(this).attr('rel');

  var user = getUser(username);

  $('#userInfoName').text(user.fullname);
  $('#userInfoAge').text(user.age);
  $('#userInfoGender').text(user.gender);
  $('#userInfoLocation').text(user.location);

};

function getUser(username) {
  var position = users.map(function (item) {
    return item.username;
  }).indexOf(username);

  return users[position];
}

function addUser(event) {
  event.preventDefault();
  var errorCount = 0;
  $('#addUser input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  if (errorCount === 0) {
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/add',
      dataType: 'JSON'
    }).done(function (response) {
      if (response.msg === '') {
        $('#addUser fieldset input').val('');
        populateTable();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  } else {
    alert('Please fill in all fields');
    return false;
  }
};

function deleteUser(event) {
  event.preventDefault();

  var confirmation = confirm('Are you sure you want to delete this user?');
  if (confirmation === true) {
    $.ajax({
      type: 'DELETE',
      url: '/users/delete/' + $(this).attr('rel')
    }).done(function (response) {
      if (response.msg === '') {
        populateTable();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  } else {
    return false;
  }
};

function populateExistingDetails(event) {
  event.preventDefault();
  var id = $(this).attr('rel');
  var position = users.map(function (item) {
    return item._id;
  }).indexOf(id);

  var user = users[position];

  $('#editUser fieldset input#editUserId').val(user._id);
  $('#editUser fieldset input#editUserName').val(user.username);
  $('#editUser fieldset input#editUserEmail').val(user.email);
  $('#editUser fieldset input#editUserFullname').val(user.fullname);
  $('#editUser fieldset input#editUserAge').val(user.age);
  $('#editUser fieldset input#editUserLocation').val(user.location);
  $('#editUser fieldset input#editUserGender').val(user.gender);
};

function editUser(event) {
  event.preventDefault();
  var id = $('#editUser fieldset input#editUserId').val();

  var errorCount = 0;
  $('#editUser input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });
  if (errorCount === 0) {
    var editedUser = {
      'username': $('#editUser fieldset input#editUserName').val(),
      'email': $('#editUser fieldset input#editUserEmail').val(),
      'fullname': $('#editUser fieldset input#editUserFullname').val(),
      'age': $('#editUser fieldset input#editUserAge').val(),
      'location': $('#editUser fieldset input#editUserLocation').val(),
      'gender': $('#editUser fieldset input#editUserGender').val()
    };
    $.ajax({
      type: 'PUT',
      data: editedUser,
      url: '/users/edit/' + id,
      dataType: 'JSON'
    }).done(function (response) {
      if (response.msg === '') {
        $('#editUser fieldset input').val('');
        populateTable();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  } else {
    alert('Please fill in all fields');
    return false;
  }
};