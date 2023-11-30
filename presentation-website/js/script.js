function toggleTheme(onLoad = false){
    const body = document.body;      
    let theme = localStorage.getItem("theme");    
    
    if (!theme){
        theme = "light";
    }

    if (onLoad) {
        if (theme === "dark") {        
            document.documentElement.setAttribute('data-bs-theme', 'dark')
            let icon = document.querySelector("#icon_id");
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");   
        } 
        else {     
            let icon = document.querySelector("#icon_id");
            console.log(icon)
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");  
            document.documentElement.setAttribute('data-bs-theme', 'light')
            console.log(icon)  
        }  
    }
    else {
        if (theme === "light") {        
            let icon = document.querySelector("#icon_id");
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            document.documentElement.setAttribute('data-bs-theme', 'dark')   
            localStorage.setItem("theme", "dark");
        } 
        else {
            let icon = document.querySelector("#icon_id");
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");     
            document.documentElement.setAttribute('data-bs-theme', 'light')   
            localStorage.setItem("theme", "light");
        }   
    }  
}

document.addEventListener("DOMContentLoaded", function() {
    toggleTheme(true);
});