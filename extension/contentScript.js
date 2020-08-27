function tryModifyInput(element, event){ 
    if (event.key == ".") {
        tryParse(element);         
    }
}

async function tryParse(element) {
    i = 0
    var handled
    while (i < element.value.length) {
        if (element.value[i] == "<") {
            j = i+1
            while (j < element.value.length && element.value[j]!= ">") { j += 1 }
            if (j  != element.value.length) { 
                handled = await tryReplace(element, i, j)
            }
        }
        i += 1
    }

    if (handled && element.value[element.value.length-1] == ".") {
        element.value = element.value.substring(0, element.value.length-1)
    }
}

function getValue(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(result) {
            resolve(result)
        })
    }, 2000)
}

async function tryReplace(element, starting, ending) {
    variableName = element.value.substring(starting+1, ending)
    alreadyReplaced = false
    var value = await getValue(variableName)
    var key_value = Object.entries(value)[0]
    if (key_value != undefined && !alreadyReplaced){ 
        alreadyReplaced = true
        element.value = element.value.substring(0, starting) + key_value[1] + element.value.substring(ending+1, 
            element.value.length)
            return true
    }
    return false
}

function addListenerToType(type) {
    var elements = document.querySelectorAll(type)
    for (x=0;x<elements.length; x++) {
        element = elements[x]
        try {
            element.addEventListener('keydown', function(event) {
                event.stopImmediatePropagation()
                tryModifyInput(this, event)
            })
        }
        catch {

        }

        }
}

function addListenersToTypes(types) {
    types.forEach(type => addListenerToType(type))
}
var types = ["input","textarea"]
var lengths = types.map(type => document.querySelectorAll(type).length)
addListenersToTypes(types)
window.setInterval(onInterval, 7000)

function onInterval() {

    var new_lengths = types.map(type => document.querySelectorAll(type).length)
    for (x=0; x<new_lengths.length; x++) {
        if (new_lengths[x] != lengths[x]) {
            lengths[x] = new_lengths[x]
            addListenerToType(types[x])
        }
    }

}



