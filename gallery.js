setTimeout(() => {
  if (db) {
    // Video retrieval
    let dbTransaction = db.transaction("video", "readonly");
    let videoStore = dbTransaction.objectStore("video");
    let videoRequest = videoStore.getAll();

    videoRequest.onsuccess = (e) => {
      let galleryCont = document.querySelector(".gallery-cont");
      let videoResult = videoRequest.result;

      videoResult.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);

        mediaElem.innerHTML = `
          <div class="media">
              <video autoplay loop src="${url}"></video>
          </div>
          <div class="delete">Delete</div>
          <div class="download">Download</div>
        `;
        galleryCont.appendChild(mediaElem);

        let deleteBtn = mediaElem.querySelector('.delete');
        deleteBtn.addEventListener('click', deleteListener);
        let downloadBtn = mediaElem.querySelector('.download');
        downloadBtn.addEventListener('click', downloadListener);
      });
    };

    // Image retrieval
    let imgDBTransaction = db.transaction("image", "readonly");
    let imageStore = imgDBTransaction.objectStore("image");
    let imageRequest = imageStore.getAll();

    imageRequest.onsuccess = (e) => {
      let galleryCont = document.querySelector(".gallery-cont");
      let imageResult = imageRequest.result;

      imageResult.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);
        let url = imageObj.url;

        mediaElem.innerHTML = `
          <div class="media">
              <img src="${url}" alt="Captured Image">
          </div>
          <div class="delete">Delete</div>
          <div class="download">Download</div>
        `;
        galleryCont.appendChild(mediaElem);

        let deleteBtn = mediaElem.querySelector('.delete');
        deleteBtn.addEventListener('click', deleteListener);
        let downloadBtn = mediaElem.querySelector('.download');
        downloadBtn.addEventListener('click', downloadListener);
      });
    };
  }
}, 100);

function deleteListener(e) {
  // Delete from DB
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  
  if (type === "vid") {
    let dbTransaction = db.transaction("video", "readwrite");
    let videoStore = dbTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (type === "img") {
    let imgDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imgDBTransaction.objectStore("image");
    imageStore.delete(id);
  }

  // UI delete
  e.target.parentElement.remove();
}

function downloadListener(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);

  if (type === "vid") {
    let dbTransaction = db.transaction("video", "readonly");
    let videoStore = dbTransaction.objectStore("video");
    let videoRequest = videoStore.get(id);

    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let videoURL = URL.createObjectURL(videoResult.blobData);
      let a = document.createElement('a');
      a.href = videoURL;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (type === "img") {
    let imgDBTransaction = db.transaction("image", "readonly");
    let imageStore = imgDBTransaction.objectStore("image");
    let imageRequest = imageStore.get(id);

    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;

      // Check if imageResult is valid
      if (imageResult && imageResult.url) {
        let a = document.createElement('a');
        a.href = imageResult.url;
        a.download = "image.jpg";  // You can use a dynamic name if needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Image result is invalid or undefined.");
      }
    };

    imageRequest.onerror = (e) => {
      console.error("Error fetching the image from IndexedDB", e);
    };
  }
}
