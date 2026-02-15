<template>
   <div id="container">
    <div id="login">
        <h2>Login Here</h2>
        <form>
        <div class="input-box">
    <input type="text" name="userName" v-model="formObj.userName" placeholder="USERNAME"  /><span>👤</span>
    </div>
     <p v-if="error.userName">{{ error.userName }}</p>
    <div class="input-box">
    <input type="password" name="password" v-model="formObj.password" placeholder="PASSWORD" /><span>🔒</span>
    </div>
    <p v-if="error.password">{{ error.password }}</p>
    <button type="submit" value="submit" @click="submitForm"> LOG IN </button>
    </form>
    </div>
   </div> 
</template>


<script>
import axios from 'axios';
export default {
    name : 'LoginPage',
    data() {
        return {
            formObj:{
                userName:"",
                password:""
            },
            error:{
                userName:"",
                password:""
            }
        }
    },
    methods:{
       async submitForm(e){
        e.preventDefault();
         this.error={
             userName: "",
             password: ""
         }
        if(!this.formObj.userName){
            this.error.userName="Username cannot be empty"
        } //else if(this.formObj.userName.length<5){
        //         this.error.userName="Username should be greater than 5"
        //     }
        if(!this.formObj.password){
            this.error.password="Password cannot be empty"
        } //else if(this.formObj.password){
        //     if(this.formObj.password.length<8){
        //         this.error.password="password is to short"
        //     }
        //     if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!$%*?&])[a-zA-Z\d$%&*@!?]{8,}$/.test(this.formObj.password)){
        //         this.error.password="password must be at least 8 characters long, include at least one uppercase, lowercase, number, and special character";
        //     }
        // } 
        if(this.formObj.userName && this.formObj.password){
            try{
            console.log(this.formObj)
            const response = await axios.post('http://localhost:8080/api/users/loginUser', this.formObj)
                const data = response.data;
                console.log(data)
                if(data.token){
                    localStorage.setItem("token", data.token);
                    this.$router.push("/display")
                } else{
                    alert("login failed, token not received")
                }
            } catch(error){
                console.log(error.message);
                alert("Login failed. Invalid credentials.");
            }
        }
         
       }
    }
}
</script>


<style scoped>
#container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 10%;
    
}
#login{
    height: 50%;
    width: 30%;
    background-color: #f8f7f7;
    text-align: center;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(133, 132, 132, 0.3);
}
h2{
    color: #333;;

}
.input-box{
    height: 15%;
    width: 73%;
    border-radius: 5px;
    border: black solid 1px;
    background-color:white;
    margin-left:12%;
    margin: 10%;
}
input{
    height: 15%;
    padding: 2%;
    margin: 0.8;
    width: 73%;
    font-size: 16px;
    outline: none;
    border: none;
}
button{
    border-radius: 10px;
    color: white;
    background-color: green;
    padding: 2%;
    margin: 6%;
    height: 10%;
    width: 53%;
    font-weight: bolder;
    font-size: 16px;  
    border: none;
}
button:hover{
    background-color: #4CAF50;
    transition: 0.03ms;
}
p{
    margin-top: -9%;
    color: red;
    font-size: 14px;
    padding: 1%;
}
</style>