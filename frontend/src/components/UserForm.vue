<template>
    <div id="container">

        <div id="box">

            <form>
                <h1>User Form</h1>
                <div>
                    <div class="column">
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" placeholder="Enter your first name"
                            v-model="formObj.firstName">
                    </div>
                    <p v-if="error.firstName">{{ error.firstName }}</p>
                </div>
                <div>
                    <div class="column">
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" placeholder="Enter your last name"
                            v-model="formObj.lastName">
                    </div>
                    <p v-if="error.lastName">{{ error.lastName }}</p>
                </div>
                <div>
                    <div class="column">
                        <label for="dob">Date of Birth:</label>
                        <input type="date" id="dob" name="dob" placeholder="MM-DD-YYYY" v-model="formObj.dob">
                    </div>
                    <p v-if="error.dob">{{ error.dob }}</p>
                </div>
                <div>
                    <div class="column">
                        <label for="mobileNumber">Mobile number:</label>
                        <input type="tel" maxlength="10" id="mobileNumber" name="mobileNumber"
                            placeholder="Enter your mobile number" v-model="formObj.mobileNumber">
                    </div>
                    <p v-if="error.mobileNumber">{{ error.mobileNumber }}</p>
                </div>
                <div>
                    <div class="column">
                        <label for="address">Address:</label>
                        <textarea id="address" name="address" placeholder="Enter your address"
                            v-model="formObj.address"></textarea>
                    </div>
                    <p v-if="error.address">{{ error.address }}</p>
                </div>
                <div class="column">
                    <button id="save" v-on:click="saveData" type="submit">SAVE</button>
                    <button id="show" v-on:click="displayData" type="button">SHOW TABLE</button>
                </div>
            </form>

        </div>
    </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue';
import type { AxiosResponse } from 'axios'; 
import { useRouter } from 'vue-router';
import type { User, ApiResponse } from '../types/interfaces.ts';
import api from "../api/axiosSetup";

//create instance
const router = useRouter();

const formObj = reactive<User>({
    firstName: '',
    lastName: '',
    dob: '',
    mobileNumber: '',
    address: ''
})

const error = reactive<Record<keyof User, string>>({
    firstName: '',
    lastName: '',
    dob: '',
    mobileNumber: '',
    address: ''
})

//save data method 
async function saveData(e: Event) {
    e.preventDefault();

    //Reset errors
    (Object.keys(error) as (keyof User)[]).forEach((key) => (error[key] = ""))

    if (!formObj.firstName) {
        error.firstName = 'First Name is missing';
    } else {
        if (formObj.firstName.length < 3) {
            error.firstName = 'First Name should be greater than 3';
        }
        if (!/^[A-Za-z]+$/.test(formObj.firstName)) {
            error.firstName = 'First Name cannot be numbers';
        }
    }

    if (!formObj.lastName) {
        error.lastName = 'Last Name is missing';
    } else {
        if (formObj.lastName.length < 3) {
            error.lastName = 'Last Name should be greater than 3';
        }
        if (!/^[A-Za-z]+$/.test(formObj.lastName)) {
            error.lastName = 'Last Name cannot be numbers ';
        }
    }

    const today = new Date();

    if (formObj.dob) {
        const isDate = new Date(formObj.dob);
        if (isDate > today) {
            error.dob = 'Enter a valid date ';
        }
    }

    if (!formObj.dob) {
        error.dob = 'Date of birth is missing';
    }
    if (!formObj.mobileNumber) {
        error.mobileNumber = 'Mobile Number is missing';
    } else {
        if (!/^[6-9]\d{9}$/.test(formObj.mobileNumber)) {
            error.mobileNumber = 'Mobile Number is of 10 digit only and starts with 6 to 9';
        }
        if (/^[A-Za-z]+$/.test(formObj.mobileNumber)) {
            error.mobileNumber = 'Mobile Number is of numbers only';
        }
    }

    if (!formObj.address) {
        error.address = 'Address is missing';
    }

    if (formObj.dob) {
        const date = new Date(formObj.dob);

        formObj.dob = date.toISOString().split("T")[0] as string
    }
try{
     const response: AxiosResponse<ApiResponse<User>, User> =
         await api.post('users/saveUser', formObj);
            console.log(response.data)
            alert("Data has been submitted");

            //reset form
            (Object.keys(formObj) as (keyof User)[]).forEach((key) => (formObj[key] = ""));
}catch(error){
     const err = error as Error;
            console.log(err);

}

}

// Navigate to display page
function displayData() {
    router.push('/display');
}

</script>


<style scoped>
#container {
    margin-top: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: lavender;
    border-radius: 5vh;
}

h1 {
    color: rgb(1, 1, 60);

    text-align: center;

}

p {
    flex-basis: 100%;
    color: red;
    font-weight: bold;

    margin-top: -2%;
    margin-left: 39%;
}

#box {

    height: 80%;
    width: 50%;
    background-color: white;
    border-radius: 5vh;
}

.column {
    display: flex;

}

.column label,
button {
    width: 30%;
    margin: 2%;
    padding: 1%;
    font-size: 18px;
    font-weight: bold;
}

.column input,
textarea {
    width: 50%;
    margin: 2%;
    padding: 1%;
    font-size: 14px;
    height: 15%;
    border-radius: 6px;
}

.column textarea {
    resize: vertical;
}

.column button {
    color: white;
    border-radius: 6px;
    margin-left: 10%;
}

#save {
    background-color: green;
    border-color: green;
}

#show {
    background-color: blue;
    border-color: blue;
}
</style>
