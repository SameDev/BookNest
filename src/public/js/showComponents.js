const showComponent = (e) => {
    var atributo = e.getAttribute("value");
    var component = document.getElementById(atributo)

    if (component.style.display == "" || component.style.display == "none") {
        component.style.display = "block"
    } else {
        component.style.display = "none"
    }
}