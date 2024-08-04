const sideNavigation = document.querySelector(".sideNavigation"),
    sideBarToggle = document.querySelector(".fa-bars"),
    startContentUl = document.querySelector(".startContent ul"),
    inputArea = document.querySelector(".inputArea input"),
    sendRequest = document.querySelector(".fa-paper-plane"),
    chatHistory = document.querySelector(".chatHistory ul"),
    startContent = document.querySelector(".startContent"),
    chatContent = document.querySelector(".chatContent"),
    results = document.querySelector(".results");

const promptQuestions = [
    {
        question: "Write a thank you note to my subscribers",
        icon: "fa-solid fa-wand-magic-sparkles",
    },
    {
        question: "Write a sample code to learn Javascript",
        icon: "fa-solid fa-code",
    },
    {
        question: "How to become a full-time developer",
        icon: "fa-solid fa-laptop-code",
    },
    {
        question: "How to become a front-end developer",
        icon: "fa-solid fa-database",
    },
];

window.addEventListener("load", () => {
    promptQuestions.forEach(data => {
        let item = document.createElement("li");
        item.addEventListener("click", () => {
            getGeminiResponse(data.question, true);
        });
        item.innerHTML = `<div class="promptSuggestion">
            <p>${data.question}</p>
            <div class="icon"><i class="${data.icon}"></i></div>
        </div>`;

        startContentUl.appendChild(item);
    });
});

sideBarToggle.addEventListener("click", () => {
    sideNavigation.classList.toggle("expandClose");
});

inputArea.addEventListener("keyup", (e) => {
    if (e.target.value.length > 0) {
        sendRequest.style.display = "inline";
    } else {
        sendRequest.style.display = "none";
    }
    if (e.key === "Enter" && e.target.value.length > 0) {
        getGeminiResponse(e.target.value, true);
    }
});

sendRequest.addEventListener("click", () => {
    getGeminiResponse(inputArea.value, true);
});

function getGeminiResponse(question, appendHistory) {
    if (appendHistory) {
        let historyLi = document.createElement("li");
        historyLi.addEventListener("click", () => {
            getGeminiResponse(question, false);
        });
        historyLi.innerHTML = `<i class="fa-regular fa-message"></i>${question}`;
        chatHistory.append(historyLi);
    }
    results.innerHTML = "";
    inputArea.value = "";

    startContent.style.display = "none";
    chatContent.style.display = "block";

    let resultTitle = `
    <div class="resultTitle">
        <img src="2.jpg" />
        <p>${question}</p>
    </div>`;

    let resultData = `
    <div class="resultData">
        <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" />
        <div class="loader">
            <div class="animatedBG"></div>
            <div class="animatedBG"></div>
            <div class="animatedBG"></div>
        </div>
    </div>`;

    results.innerHTML += resultTitle;
    results.innerHTML += resultData;

    const AIURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBE_ukAJzXnl_PQ9WAEL6IfOn4roMrBviw`;
    fetch(AIURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }],
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            document.querySelector(".results .resultData").remove();

            let responseData = jsonEscape(data.candidates[0].content.parts[0].text);
            console.log(responseData);

            let responseArray = responseData.split("**");
            let newResponse = "";

            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<strong>" + responseArray[i].split(" ").join("&nbsp;") + "</strong>";
                }
            }

            let newResponse2 = newResponse.split("*").join(" ");
            let textArea = document.createElement("textarea");
            textArea.innerHTML = newResponse2;

            results.innerHTML += `
            <div class="resultResponse">
                <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"/>
                <p id="typeEffect"></p>
            </div>`;

            let newResponseData = newResponse2.split(" ");
            for (let j = 0; j < newResponseData.length; j++) {
                timeOut(j, newResponseData[j] + " ");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            results.innerHTML = "There was an error processing your request.";
        });
}

const timeOut = (index, nextWord) => {
    setTimeout(function () {
        document.getElementById("typeEffect").innerHTML += nextWord;
    }, 75 * index);
}

function newChat() {
    startContent.style.display = "block";
    chatContent.style.display = "none";
}

function jsonEscape(str) {
    return str
        .replace(/\r?\n\n/g, "<br>")
        .replace(/\r?\n/g, "<br>");
}
