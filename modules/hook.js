export function hook(className, isMulti = false, cascadeSearch = false) {
    if (isMulti) {
        return cascadeSearch ? cascadeSearch.querySelectorAll(`${className}`) : document.querySelectorAll(`${className}`);
    } else {
        return cascadeSearch ? cascadeSearch.querySelectorAll(`${className}`) : document.querySelector(`${className}`);
    }
}
