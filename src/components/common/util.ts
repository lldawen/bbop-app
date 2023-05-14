import { closeMessagePrompt, showMessageBox } from "./confirmationModal";

export function getDropdownOptions(category: string, setter: Function) {
    async function getCodes(category: string, setter: Function) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BBOP_SERVICE_URL}/api/v1/code/category/${category}`, {
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


export function appendAdminUrl(isAdmin: boolean) {
    return isAdmin ? '/admin' : '';
}