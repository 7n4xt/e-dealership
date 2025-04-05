const url = "http://localhost:8080";

async function getdata() {
    try {
        const response = await fetch(`${url}/cars`);
        if (!response.ok) {
            throw new Error("Could not fetch data");
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching weather data:", error); 
    }
}

getdata();