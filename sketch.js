/* 
    Modified Code from - https://ml5js.org/ (DevTools - find sketch.js and style.css)
    Video help - https://youtu.be/yNkAuWz5lnY
    All Images are from wikipedia
    Image Classification with ml5 Drag and Drop
    Date: Dec/28/2018
*/ 
const log = console.log;
const image = document.getElementById("image");
const dropContainer = document.getElementById("container");
const fileInput = document.getElementById("fileUploader");
const ImageSrc = "images/penguin.jpg"; //default image

const result = document.getElementById("result");
const probability = document.getElementById("probability");
const classifier = ml5.imageClassifier("Mobilenet", () => {});

["dragenter", "dragover"].forEach(eventName => {
    dropContainer.addEventListener(eventName, e => dropContainer.classList.add("highlight"))
});

["dragleave", "drop"].forEach(eventName => {
    dropContainer.addEventListener(eventName, e => dropContainer.classList.remove("highlight"))
});

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropContainer.addEventListener(eventName, preventDefaults)
});

dropContainer.addEventListener("drop", gotImage);

classifyImage();

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
};

function gotImage(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 1) {
        alert("Upload only one file");
    };

    const file = files[0];
    const imageType = /image.*/;
    if (file.type.match(imageType)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            image.src = reader.result;
            setTimeout(classifyImage, 100);
        };
    } 
};

function createCard(imageSrc, label, probability) {
    const container = document.getElementById("image-area")
    const id = "card-" + Date.now()
    const wrapper = document.createElement("div")
    const botonDescargar = document.createElement("button")
    const botonEliminar = document.createElement("button")

    wrapper.classList.add("col-md-6")
    wrapper.classList.add("col-lg-4")
    wrapper.classList.add("result")
    wrapper.id = id

    botonDescargar.classList.add("btn")
    botonDescargar.classList.add("btn-primary")
    botonDescargar.textContent = "Descargar"

    botonEliminar.classList.add("btn")
    botonEliminar.classList.add("btn-danger")
    botonEliminar.textContent = "Eliminar"
    
    wrapper.append(botonDescargar)
    wrapper.append(botonEliminar)
    container.append(wrapper)

    botonEliminar.addEventListener("click", function() {
        container.removeChild(wrapper)
    })

    const card = new p5(cardSketch({
        imageSrc,
        label,
        probability,
        downloadBtn: botonDescargar,
    }), id)

    
}

function classifyImage() {
    classifier.predict(image, (err, results) => {
        if (err) {
            alert("Something went wrong");
        } else {
            console.log(image)
            console.log("results ", results);

            results.forEach((result, index) => {
                if(result.probability > 0.2 || index === 0) {
                    const prob = 100 * result.probability;
                    const probabilityText = Number.parseFloat(prob).toFixed(2) + "%"
                    createCard(image.src, result.className, probabilityText)    
                }
            })


            // const downloadButton = document.querySelector('#download')
            // downloadButton.addEventListener('click', card1.downloadCard)

            let resultTxt = results[0].className;
            //
            let sumPredictions = 0;
            // just in case  other predictions
            if(results[1].probability > 0.2) {
                resultTxt += " "+ results[1].className
            }
            if(results[2].probability > 0.2) {
                resultTxt += " "+ results[2].className
            }

            result.innerText = resultTxt;
            let prob = 100 * results[0].probability;
            probability.innerText = Number.parseFloat(prob).toFixed(2) + "%";

            // html2canvas(document.querySelector("#container")).then(canvas => {
            //     var a = document.body.appendChild(canvas);                
            //     download(resultTxt);
            // });
        };
    });
};

function handleFiles() {
    const curFiles = fileInput.files;
    if (curFiles.length === 0) {
        image.src = ImageSrc;
        setTimeout(classifyImage, 100);
    }; 
};

function clickUploader() {
    fileInput.click();
};

function download (filename){
    var link = document.createElement('a');
    var canvases = document.getElementsByTagName("canvas");
    link.download =  filename + '.png';
    link.href = canvases[canvases.length-1].toDataURL()
    link.click();
};