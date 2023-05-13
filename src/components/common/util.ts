import { closeMessagePrompt, showMessageBox } from "./confirmationModal";

export function getDropdownOptions(category: string, setter: Function) {
    async function getCodes(category: string, setter: Function) {
        const response = await fetch(`http://localhost:8081/api/v1/code/category/${category}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const json = await response.json();
        setter(json.data);
    }
    getCodes(category, setter);
}