<template>
<div id="container">

<div id="box">

<form >
<h1>User Form</h1>
<div class="column">
<label for="fName">First Name:</label>
<input type="text" id="fName" name="fName" placeholder="Enter your first name" v-model="formObj.fname" required>
</div>
<div class="column">
<label for="lname">Last Name:</label>
<input type="text" id="lname" name="lname" placeholder="Enter your last name" v-model="formObj.lname">
</div>
<div class="column">
<label for="dob">Date of Birth:</label>
<input type="date" id="dob" name="dob" placeholder="Enter your birth date" v-model="formObj.dob">
</div>
<div class="column">
<label for="mnumber">Mobile number:</label>
<input type="tel" pattern="\d{10}" maxlength="10" id="mnumber" name="mnumber" placeholder="Enter your mobile number" v-model="formObj.mnumber" required>
</div>
<div class="column">
<label for="address">Address:</label>
<textarea id="address" name="address" placeholder="Enter your address" v-model="formObj.address"></textarea>
</div>
<div class="column">
<button v-on:click="saveData" type="button">SAVE</button>
<button v-on:click="displayData" type="button">SHOW TABLE</button>
</div>
</form>
<p v-if="error">{{error}}</p>
</div>
</div>
</template>

<script>
    import axios from 'axios';
export default {

    name: 'UserForm',
    data() {
        return {
            formObj:{
            fname: '',
            lname: '',
            dob: '',
            mnumber: '',
            address: ''
        },
       error:''
        }
        
    },
    methods:{
        async saveData(){
            this.error=''
            for(const item in this.formObj){
                if(this.formObj[item]===''){
                    this.error='Some error occured. Please fill the complete data again';
                    return
                }
            }
            await axios.post('http://localhost:8080/api/users', this.formObj)
                .then(response => {
                console.log(response.data)
                this.error="Data has been submitted";
                this.$router.push('/');
            }) 
            .catch(error =>{
                console.log(error);
                this.error="Please fill the complete data or may be record already exist";
                
            })
           
        },
        displayData(){
           this.$router.push('/display');
        }
    }

}

</script>

<style scoped>
#container {
    display:flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: lavender;
    border-radius: 5vh;
}
h1{
    color: red;
    text-align: center;
}
p{
    color:red;
    font-weight:bold;
    margin: 2vh;
}
#box{
    border: 2px solid black;
    height: 80%;
    width: 50%;
    background-color: #9966CC;
    border-radius: 5vh;
}
.column {
    display: flex;
    padding-top: 1vh;
}
.column label,button {
    width: 30%;
    margin: 2%;
    padding: 1%;
    font-size: 18px;
    font-weight: bold;
}
.column input, textarea{
    width: 50%;
   margin: 2%;
    padding: 1%;
    font-size: 14px;
    height: 20%;
}
.column textarea{
    resize: vertical;
}
.column button{
    color: white;
    background-color: green;
    margin-left: 10%;
}
</style>
