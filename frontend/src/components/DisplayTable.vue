<template>
<div>
    <div id="header">
<h1>User Details</h1>
</div>
<div id="navbar">
    <div id="createUser">
          <input id="new-user" type="button" v-on:click="createNewUser" value="CREATE NEW USER"/>

    </div>
<div id="search-embedded"> 
<input type="search" placeholder="Search here" v-model="search" @keyup.enter="onSearch"/>
<img src="\images\search-icon.png" alt="search-icon"  @click="onSearch"/>
</div>
<div id="logOut">
        <button @click="logoutUser" >LOGOUT</button>
</div>
</div>
<div id="table">
    <div>
<table>
<thead>
<tr >
<th>First Name</th>
<th>Last Name</th>
<th>Date of birth</th>
<th>Mobile Number</th>
<th>Address</th>
<th>Action</th>
</tr>
</thead>
<tbody>
<tr v-for="user in display_value" :key="user.user_id">
<td>{{ user.first_name }}</td>
<td>{{ user.last_name }}</td>
<td>{{ user.dob }}</td>
<td>{{ user.mobile_number }}</td>
<td class="address-cell">{{ user.address }}</td>
<td>
<input id="edit" type="button" v-on:click="editData(user.user_id)" value="EDIT">
<input id="delete" type="button" v-on:click="deleteData(user.user_id)" value="DELETE">
</td>
</tr>
<tr v-if="display_value.length==0">
    <td colspan="6">No data found</td>
</tr>
</tbody>
</table>
</div>
<div id="sorting">
<h2>Select </h2>
<h3>Choose table order key</h3>
<select @change="changeSort(sortBy)" v-model="sortBy">
    <option disabled value="">Please select one</option>
    <option value="first_name">First Name</option>
    <option value="last_name">Last Name</option>
    <option value="dob">Date of Birth</option>
    <option value="mobile_number">Mobile Number</option>
    <option value="address">Address</option>
</select>

<br/>
<h3>Choose direction of order</h3>
<select @change="changeDirection(direction)" v-model="direction">
    <option disabled value="">Please select one</option>
    <option value="ASC">Ascending</option>
    <option value="DESC">Descending</option>
</select>
<br/>
<h3>Choose page number</h3>
<select v-model="page" @change="onSearch">
    <option disabled value="">Please select one</option>
    <option v-for="pages in totalPages" :key="pages" :value="pages">{{ pages }}</option>
    
</select>
</div>
</div>
<br/>
<div id="pagination">
    <input class="button-style" type="button" value="PREVIOUS" @click="changePage('prev')"/>
    <span class="button-style">{{ page }}</span>
    <input class="button-style" type="button" value="NEXT" @click="changePage('next')"/> <!--string passed as a variable -->
</div>
</div>
</template>
<script setup lang="ts">
 import type { AxiosResponse } from 'axios';
 import { reactive, onMounted, ref } from 'vue'
 import { useRouter } from 'vue-router';
 import { useRoute } from 'vue-router';
 import type { UserTableData, ApiResponse, UserResponse, searchParams } from '../types/interfaces.js'
 import api from "../api/axiosSetup.js";

const route = useRoute();
const router = useRouter();


//ref used for ractive changes for primitive data types and arrays
const display_value = ref<UserTableData[]>([]);

const search = ref("");        // string
const lastSearch = ref("");    // string
const page = ref(1);           // number
const limit = ref(5);          // number
const sortBy = ref("");        // string
const direction = ref("");     // string
const totalRecord = ref(0);    // number
const totalPages = ref(0);     // number

//logout
async function  logoutUser(){
   try{
    const response:AxiosResponse<ApiResponse<null>> =
         await api.post ('users/logout',{})
        // console.log(response)
     router.push("/");
     alert("Logout successfully");
   }catch(error){
    const err = error as Error;
    console.log(err);
   }

}

function  changeDirection(value: string){
        if(value=='AES') {
            direction.value == "AES"
        }
        if(value=='DESC') {
    direction.value = "DESC"
        }
        onSearch();
    }

 function changeSort(value : string){
        if (value=='first_name'){
            sortBy.value=="first_name";
        }
        if (value=='last_name'){
            sortBy.value="last_name";
        }
        if (value=='dob'){
            sortBy.value="dob";
        }
        if (value=='mobile_number'){
            sortBy.value="mobile_number";
        }
        if (value=='address'){
            sortBy.value="address";
        }
        onSearch();
    }

async function  fetchUser(){
        try{
          
            const url='users/getAllUsers';
            const params: searchParams ={search:search.value,
                page:page.value,
                limit:limit.value,
                sortBy:sortBy.value,
                direction:direction.value};
         
        const result:AxiosResponse<ApiResponse<UserResponse>> = await api.get(url,{params} )
        //console.log(result.data.data.users)
        const users = result.data.data.users
        display_value.value=users;
        
        if(users.length>0 && users[0]?.total_count !== undefined){
                totalRecord.value= Number(users[0].total_count); 
            }
            totalPages.value= Math.ceil(totalRecord.value/limit.value);
       
        } catch(error) {
            const err = error as Error;
            console.log(err);
        }
        
    }
    
function  changePage(value: string){
        if(value == 'prev' && page.value>1){
            --page.value
            onSearch();
            //console.log(page.value)
        }
        if(value=='next' && page.value<totalPages.value){
            ++page.value
            onSearch();
            //console.log(page.value)
        }
        
    }

async function onSearch(){
        if(search.value.trim() !== lastSearch.value){
            page.value = 1;
        }
        lastSearch.value=search.value.trim()
        await fetchUser();
        
    }

function  createNewUser(){
        router.push('/add-user')
    }

 function editData(user_id: number){
        router.push(`/edit/${user_id}`);
    }

    async function deleteData(user_id: number){
        try{
          
            const result: AxiosResponse<ApiResponse<UserResponse>> = await api.delete(`users/deleteUser/${user_id}`)
            // console.log(result)
            // console.log(result.data)
            // console.log(result.data.data.users)
             display_value.value= result.data.data.users;
        } catch(error){
            const err = error as Error;
            console.log("error in data deletion",err)
        }
    
    }

    //Lifecycle 
onMounted( async () =>{
    await fetchUser();

})

</script>
<style scoped>

#header{
    margin-left: 9%;
    margin-right: 9%;
    border-radius: 3px;
    border: 1px solid white; 
    background-color: rgb(5, 5, 64);
    border-radius: 5px;
}
h1{
    color: white;
    text-align: center;
    
}


table, tr, td, th {
    border: 1px #ddd solid;
    border-collapse: collapse;
    
}
table td{
    font-size: 14px;
    padding:2vh;
    
}
tr:nth-child(even) {
    background-color: #D6EEEE;
}
tr:nth-child(odd) {
    background-color: #f9f9f9;
}
table th{
    color: white;
    font-weight: bold;
    font-size: 18px;
    padding: 2vh;
     background-color: #1E3A8A ;

}

#table {
    display: flex;
    justify-content: center;
}
td.address-cell{
    min-width: 200px;
    max-width: 200px;
    white-space: normal;  
    word-wrap: break-word;

}
input[type=button], table tr td input{
    padding: 1vh;
   margin-left:1vh;
    color:white;
    background-color: black;
    border-radius: 5px;

}
#edit {
    background-color: blue;
    border-color: blue;
}
#delete{
    background-color: red;
    border-color: red;
}
#new-user{
    margin-left: 11%;
    background-color: green;
    border-color: green;
}
#logOut{
     margin-left: 17%;
}
#logOut button{
   
    background-color: red;
    border: none;
    padding: 1vh;
   margin-left:1vh;
    color:white;
    width: 150%;
    border-radius: 5px;
    font-weight: bolder;
}
#logOut button:hover{
    background-color:  #c1121f;
}
#search-embedded{
    border: solid black 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2%;
    height:15%;
    padding: 0.5%;
    border-radius: 9px;
    padding-left: 1%;
    width: 22%;
    margin-left: 10%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
#search-embedded input[type=search]{
    border:none;
    outline: none;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
   
}
#search-embedded img{
    height: 5%;
    width: 5%;
}
#pagination .button-style{
    width: 10%;
    margin-left:10%;
    margin-right:4%;
}
#pagination{
    padding: 0.4%;
    margin-left: 20%;
   
 }
#pagination span{
    padding: 0.5%;
    padding-left: 3%;
    padding-right: 3%;
   border-radius: 2px;;
    color:white;
    background-color: black;
}
#sorting {
    margin-top:1%;
    margin-left: 3%;
    background-color: #f9fafb;
    padding: 2%;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
#sorting h2{
    color: #1e3a8a;
}
#sorting h3{
     color: #333;
}
#sorting select{
    border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
}

select {
    border: solid black 1px;
    height: 10%;
    width: 79%;
    padding: 0.5%;
}
#navbar{
   
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>