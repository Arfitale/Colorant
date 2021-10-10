export function hook(className, isMulti = false, cascadeSearch = "") {
    if (isMulti) {
        return cascadeSearch ? cascadeSearch.querySelectorAll(`${className}`) : document.querySelectorAll(`${className}`);
    } else {
        return cascadeSearch ? cascadeSearch.querySelector(`${className}`) : document.querySelector(`${className}`);
    }
}
