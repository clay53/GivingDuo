console.log("Giving Duo has been injected into this page.");

var donePosts = [];

var onNextLove;

function onNormalButton(normalButton) {
    if (onNextLove && onNextLove.normalButton !== normalButton) {
        onNextLove = undefined;
    }
}

function checkPosts () {
    const foundPosts = document.getElementsByClassName("_2zt48");
    for (let post of foundPosts) {
        if (!donePosts.includes(post)) {
            let normalButtonSpan = post.firstChild;
            if (normalButtonSpan !== null) {
                let normalButton = normalButtonSpan.firstChild;
                if (normalButton.tagName === "A") {
                    normalButton.addEventListener("click", () => {onNormalButton(normalButton)});
                    normalButtonSpan.insertAdjacentElement('afterend', genGiveLingotsButton(normalButton));
                } else {
                    console.error("Tag of first child of first child of _2zt48 was not an a tag - this likely means you're out of lingots ;(");
                }
            } else {
                console.error("Couldn't find first child of _2zt48 - this likely means you're out of lingots ;(");
            }
            donePosts.push(post);
        }
    }
}

checkPosts();

new MutationObserver((mutations, observer) => {
    checkPosts();
}).observe(
    document,
    {
        childList: true,
        subtree: true
    }
);

function genGiveLingotsButton(normalButton) {
    let span = document.createElement("span");
    span.className = "_5j_V-";
    
    let a = document.createElement("a");
    a.className = "_2xNPC";
    a.href = "javascript:;";
    a.innerText = ", Give Lingots";
    a.addEventListener("click", event => {handleGiveLingotsClick(event, normalButton)});
    
    span.appendChild(a);

    return span;
}

async function handleGiveLingotsClick(event, normalButton) {
    var response = prompt("How many lingots? This may take a while due to intentional speed limits applied by Duolingo, there will be an alert when sending is complete w/ progress updates in console. (Note: you only need to press OK for the first alert; times out after 5 seconds)");
    var count = Number.parseInt(response);
    if (Number.isSafeInteger(count) && count > 0) {
        onNextLove = {
            normalButton: normalButton,
            count: count
        };
        normalButton.click();
        onNextLove.timeout = setTimeout(() => {onNextLove.normalButton = undefined}, 5000);
    } else {
        alert("Invalid value");
    }
}

chrome.runtime.onMessage.addListener(async (request) => {
    console.log(onNextLove, request);
    console.log(request.identifier === "LOVE-URL", request.value !== undefined);
    if (request && request.identifier === "LOVE-URL" && request.value !== undefined) {
        url = request.value;
        if (onNextLove && Number.isSafeInteger(onNextLove.count)) {
            var count = onNextLove.count;
            clearTimeout(onNextLove.timeout);
            onNextLove = undefined;
            for (let i = 1; i < count; i++) {
                await fetch(
                    request.value,
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );
                console.log(`Gave lingot ${i+1}/${count}.`);
            }
        }
    }
});