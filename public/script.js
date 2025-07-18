const modelURLBase = "./tm-my-image-model-2/";
const GEMINI_API_KEY = "AIzaSyCCVd-50ccgdiyIrSZcOB_5TkgQ7aCrLCw";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

let model, webcam, maxPredictions;
let selectedImage = null;

async function loadModel() {
    if (!model) {
        model = await tmImage.load(modelURLBase + "model.json", modelURLBase + "metadata.json");
        maxPredictions = model.getTotalClasses();
    }
}

async function initWebcam() {
    await loadModel();
    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();
    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("uploaded-image-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    selectedImage = "webcam";
    document.getElementById("submitBtn").disabled = false;
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = function () {
            if (webcam) webcam.stop();
            document.getElementById("webcam-container").innerHTML = "";
            document.getElementById("uploaded-image-container").innerHTML = "";
            img.width = 300; img.height = 300;
            document.getElementById("uploaded-image-container").appendChild(img);
            selectedImage = img;
            document.getElementById("submitBtn").disabled = false;
        };
        img.src = URL.createObjectURL(file);
    }
});

async function submitForPrediction() {
    await loadModel();
    if (!selectedImage) return alert("Select an image or start webcam.");
    let source = (selectedImage === "webcam") ? webcam.canvas : selectedImage;
    const prediction = await model.predict(source);
    const topClass = prediction.reduce((a, b) => a.probability > b.probability ? a : b);
    document.getElementById("detected-food").innerHTML = `🍔 Detected: <strong>${topClass.className}</strong>`;
    getFoodDetailsFromGemini(topClass.className);
}

async function getFoodDetailsFromGemini(foodLabel) {
    const prompt = `
You are an AI nutritionist.

Give a **very concise JSON summary** for the food item "${foodLabel}".  

🚫 **Do NOT provide examples or compare to other foods.**  
🚫 **Do NOT describe any other food item.**  
🚫 **Only answer about "${foodLabel}".**  

Respond in this **exact JSON structure**:

{
  "name": "${foodLabel}",
  "short_description": "",
  "nutrition_table": {
    "Calories": "",
    "Protein": "",
    "Carbs": "",
    "Fats": ""
  },
  "health_note": "",
  "portion_advice": "",
  "fun_fact": ""
}

Guidelines:
- Use **simple, short sentences (max 30-40 words each).**  
- **No examples, no comparisons.**  
- Make it **UI-friendly and brief**.
`;

    const body = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        displayAIOutput(aiResponse);

    } catch (err) {
        document.getElementById("ai-output").innerHTML = "⚠️ Network error: " + err.message;
    }
}

function cleanDuplicateSections(jsonData) {
    const keys = ["short_description", "health_note", "portion_advice", "fun_fact"];
    keys.forEach(key => {
        if (jsonData[key]) {
            let parts = jsonData[key].split(/(?<=\.)\s+/);
            jsonData[key] = [...new Set(parts)].join(" ");
        }
    });
    return jsonData;
}

async function displayAIOutput(aiText) {
    try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            document.getElementById("ai-output").innerHTML = "⚠️ Could not parse AI response.";
            return;
        }

        const jsonData = cleanDuplicateSections(JSON.parse(jsonMatch[0]));
        const container = document.getElementById("ai-output");
        container.innerHTML = "";

        const sections = [
            { title: jsonData.name, content: simplifyText(jsonData.short_description, 35) },
            { title: "Nutritional Overview", content: jsonData.nutrition_table },
            { title: "Health Notes", content: simplifyText(jsonData.health_note, 35) },
            { title: "Portion Advice", content: simplifyText(jsonData.portion_advice, 35) },
            { title: "Fun Fact", content: simplifyText(jsonData.fun_fact, 35) }
        ];

        await typeSections(container, sections, 0);

    } catch (err) {
        document.getElementById("ai-output").innerHTML = "⚠️ Failed to parse AI response.<br><pre>" + aiText + "</pre>";
    }
}

async function typeSections(container, sections, index) {
    if (index >= sections.length) return;

    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("ai-output-section");
    container.appendChild(sectionDiv);

    const section = sections[index];

    if (section.title === "Nutritional Overview") {
        await typeText(sectionDiv, section.title + ":\n", 15, false);
        const table = document.createElement("table");
        table.classList.add("nutrition-table");
        for (const key in section.content) {
            table.innerHTML += `<tr><th>${key}</th><td>${section.content[key]}</td></tr>`;
        }
        sectionDiv.appendChild(table);
        setTimeout(() => typeSections(container, sections, index + 1), 1500);
    } else {
        const titleEl = document.createElement("strong");
        sectionDiv.appendChild(titleEl);
        await typeText(titleEl, section.title + ": ", 15, false);
        const p = document.createElement("p");
        sectionDiv.appendChild(p);
        await typeText(p, section.content, 15, false);
        setTimeout(() => typeSections(container, sections, index + 1), 1500);
    }
}

function simplifyText(text, maxWords) {
    const words = text.split(/\s+/);
    return (words.length <= maxWords) ? text : words.slice(0, maxWords).join(" ") + "…";
}

function typeText(element, text, speed, append) {
    return new Promise(resolve => {
        if (!append) element.innerHTML = "";
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                resolve();
            }
        }
        typing();
    });
}

function resetApp() {
    if (webcam) webcam.stop();
    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("uploaded-image-container").innerHTML = "";
    document.getElementById("detected-food").innerHTML = "No food detected yet.";
    document.getElementById("ai-output").innerHTML = "Upload an image and click submit to get details.";
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("custom-ai-output").innerHTML = "";
    document.getElementById("userQuestion").value = "";

    selectedImage = null;
}

async function submitUserQuery() {
    const question = document.getElementById("userQuestion").value.trim();
    const foodName = document.getElementById("detected-food").innerText.replace("🍔 Detected: ", "").replace(/<[^>]+>/g, "");

    if (!question) {
        alert("Please enter your question about the food.");
        return;
    }

    const prompt = `
You are a concise nutrition expert AI.

Answer the following **user's custom question** about the food item "${foodName}":

Question: "${question}"

Respond in this **exact JSON structure**:

{
  "food_name": "${foodName}",
  "user_question": "${question}",
  "answer": ""
}

Guidelines:
- Use **simple, short sentences (max 40 words).**
- Answer directly about "${foodName}" only.
- Be factual, no assumptions.
`;

    const body = { contents: [{ parts: [{ text: prompt }] }] };

    document.getElementById("custom-ai-output").innerHTML = "⏳ Generating answer...";

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        displayCustomAIOutput(aiResponse);

    } catch (err) {
        document.getElementById("custom-ai-output").innerHTML = "⚠️ Network error: " + err.message;
    }
}

async function displayCustomAIOutput(aiText) {
    try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            document.getElementById("custom-ai-output").innerHTML = "⚠️ Could not parse AI response.";
            return;
        }

        const jsonData = JSON.parse(jsonMatch[0]);
        const container = document.getElementById("custom-ai-output");
        container.innerHTML = "";

        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("ai-output-section");
        container.appendChild(sectionDiv);

        const titleEl = document.createElement("strong");
        sectionDiv.appendChild(titleEl);
        await typeText(titleEl, "Your Answer: ", 20, false);

        const p = document.createElement("p");
        sectionDiv.appendChild(p);
        await typeText(p, jsonData.answer, 20, false);

    } catch (err) {
        document.getElementById("custom-ai-output").innerHTML = "⚠️ Failed to parse AI response.<br><pre>" + aiText + "</pre>";
    }
}

function fillSuggestion(text) {
    document.getElementById("userQuestion").value = text;
}
