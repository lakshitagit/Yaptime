import {create} from "zustand"

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("yaptime-theme") || "coffee",
    setTheme:(theme) => {
        localStorage.setItem("yaptime-theme",theme);
        set({theme})
    },
})) 

//this object is accesible in the enitre project
//use local storage to make sure the state or the theme remains the same on refreshing
