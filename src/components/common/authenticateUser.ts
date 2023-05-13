import { useRouter } from "next/router";

const router = useRouter();

export async function authenticate(email: any, password: any, setProfile: Function) {
    try {
        const result = await fetch("http://localhost:8081/auth/authenticate", {
            method: 'POST',
            body: JSON.stringify({ 'username': email, 'password': password }),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });
        if (result.ok) {
            const json = await result.json();
            localStorage.setItem('token', json.token);
            setProfile(json);
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    } catch(exception) {
        alert('Invalid username and/or password.');
    }
}