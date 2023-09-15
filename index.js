var rand = function() {
    return Math.random().toString(36).substr(2); 
};

var token = function() {
    return rand() + rand(); 
};



if (localStorage.getItem("id") == null) {
    localStorage.setItem("id", token())
} 


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-7d2ab-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, localStorage.getItem("id"))

const inputFieldEl = document.getElementById("input-el")
const addButtonEl = document.getElementById("add-btn")
const shoppingListEL = document.getElementById("shopping-list")


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue) {
        push(shoppingListInDB, inputValue)
    }
    inputFieldEl.value = ""
})


onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        shoppingListEL.innerHTML = ""
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1] 
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEL.innerHTML = "<div class='error'>No items here...</div>"
    }
})

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `${localStorage.getItem("id")}/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    shoppingListEL.append(newEl)
}






