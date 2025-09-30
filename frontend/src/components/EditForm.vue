<template>
    <div id="container">

        <div id="box">

            <form>
                <h1>Edit Form</h1>
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
                        <input type="text" id="dob" name="dob" placeholder="MM-DD-YYYY" v-model="formObj.dob">
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
                    <button type="button" id="update" v-on:click="updateData">UPDATE</button>
                    <button v-on:click="displayData" id="back" type="button">BACK</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive, onMounted } from 'vue';
import type { AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';
import type { User, ApiResponse, UserTableData, UserTableDataMount } from '../types/interfaces.ts'
import api from "../api/axiosSetup";


const router = useRouter();
const route = useRoute();

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

onMounted(async () => {
    const user_id = Number(route.params.user_id);
    if (isNaN(user_id)) {
        console.log("user_id is not a string ")
    }
    try {

        const response: AxiosResponse<UserTableDataMount> = await api.get(`users/getUser/${user_id}`)
        console.log(response)
        const data = response.data;
        //     console.log(data);
        //     console.log(data.dob)
        //   //const dob = new Date(data.dob);
        //   console.log(data.dob)

        const isDate = new Date(data.dob).toLocaleDateString("en-CA");
        //console.log(isDate)
        const formattedDob = isDate
        //console.log(formattedDob)
        formObj.firstName = data.first_name;
        formObj.lastName = data.last_name;
        formObj.dob = formattedDob;
        formObj.mobileNumber = data.mobile_number;
        formObj.address = data.address;
    } catch (error) {
        const err = error as Error;
        console.log("error in fetching data", err);
    }
});


function displayData() {
    router.push('/display')
}

async function updateData(e: Event) {
    e.preventDefault();

    const user_id = Number(route.params.user_id);

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


    console.log(formObj)
    try {
        const response: AxiosResponse<ApiResponse<UserTableData>, User> =
            await api.put(`/users/updateUser/${user_id}`, formObj);


        // console.log("response get")
        // console.log(response.data);
        router.push('/display')
    } catch (error) {
        const err = error as Error;
        console.log(err)
    }

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
    color: rgb(1, 1, 45);
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
    padding-top: 1vh;
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
    font-size: 14;
    height: 20%;
    border-radius: 5px;
}

.column textarea {
    resize: vertical;
}

.column button {
    color: white;
    border-radius: 6px;
    margin-left: 10%;
}

#update {
    background-color: green;
    border-color: green;
}

#back {
    background-color: blue;
    border-color: blue;
}
</style>
