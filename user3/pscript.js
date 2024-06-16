function sendMessage() {
    var inputElement = document.getElementById('message-input');
    var input = inputElement.value;
    var chatWindow = document.getElementById('chat-window');
    var mediaContainer = document.getElementById('media-container');
    var mediaViewer = document.getElementById('media-viewer');
    
    // Display user input in the chat window
    chatWindow.innerHTML += '<div class="user-message">User: ' + input + '</div>';
    
    // Clear the text box
    inputElement.value = '';
  
    // Establish WebSocket connection
    var socket = new WebSocket('ws://127.0.0.1:12345');
  
    // Connection opened event
    socket.onopen = function(event) {
      // Send user input to the server
      socket.send("user3 " + input);
    };
  
    // Message received from the server event
    socket.onmessage = function(event) {
      var serverResponse = event.data;
      // Display server response in the chat window
      chatWindow.innerHTML += '<div class="bot-message">Elon: ' + serverResponse + '</div>';
      if (isValidUrl(serverResponse)) {
        var fileType = getFileType(serverResponse);
        var filePath = "C:/Users/rahim/Desktop/website/personal_assistant_webapp_with_generative_ai/user3/data/" + serverResponse;
        if (fileType === 'image') {
          mediaViewer.innerHTML = '<img src="' + filePath + '" alt="Image">';
        } else if (fileType === 'video') {
          mediaViewer.innerHTML = '<video controls><source src="' + filePath + '" type="video/mp4"></video>';
        } else if (fileType === 'audio') {
          mediaViewer.innerHTML = '<audio controls><source src="' + filePath + '" type="audio/mpeg"></audio>';
        } else if (fileType === 'document') {
          // For PDF and other documents
          mediaViewer.innerHTML = '<iframe src="' + filePath + '" width="100%" height="600px"></iframe>';
        }
        mediaContainer.style.display = 'block';
      } else {
        mediaContainer.style.display = 'none';
      }
    };
  
    // Close connection event
    socket.onclose = function(event) {
      console.log('Connection closed');
    };
  
    // Error event
    socket.onerror = function(error) {
      console.error('WebSocket error: ' + error);
    };
  
    document.getElementById('file-input').addEventListener('change', function() {
      var file = this.files[0];
      if (file) {
        uploadFile(file);
      }
    });
  
    function isValidUrl(url) {
      // Basic URL validation logic
      return url.match(/\.(jpeg|jpg|png|gif|mp4|mov|avi|wmv|mp3|wav|ogg|pdf|doc|docx|ppt|pptx|xls|xlsx)$/i);
    }
  
    function getFileType(url) {
      if (url.match(/\.(jpeg|jpg|png|gif)$/i)) {
        return 'image';
      } else if (url.match(/\.(mp4|mov|avi|wmv)$/i)) {
        return 'video';
      } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
        return 'audio';
      } else if (url.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i)) {
        return 'document';
      } else {
        return 'unknown';
      }
    }
  }
  
  function uploadFile(file) {
    var CHUNK_SIZE = 1024 * 64; // 64 KB chunk size
    var socket = new WebSocket('ws://127.0.0.1:12345');
  
    socket.onopen = function(event) {
      // Send message to indicate file upload
      socket.send("user3"); // Replace with appropriate user identifier
  
      // Send file name
      socket.send(file.name);
  
      var reader = new FileReader();
  
      reader.onload = function(event) {
        var fileData = event.target.result;
        var offset = 0;
  
        while (offset < fileData.byteLength) {
          var chunk = fileData.slice(offset, offset + CHUNK_SIZE);
          socket.send(chunk);
          offset += CHUNK_SIZE;
        }
  
        // Notify server that file transmission is completed
        socket.send("EndOfFile");
      };
  
      if (file) {
        reader.readAsArrayBuffer(file);
      }
    };
  
    socket.onerror = function(error) {
      console.error('WebSocket error: ' + error);
    };
  
    socket.onclose = function(event) {
      console.log('Connection closed');
    };
  }
  