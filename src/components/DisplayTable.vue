<template>
<div>
<h1>User Details</h1>
<div id="search-embedded">
<input type="search" placeholder="Search here" v-model="search" @keyup.enter="onSearch"/>
<img src="\images\search-icon.png" alt="search-icon"  @click="onSearch"/>
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
<td>{{ user.address }}</td>
<td>
<input type="button" v-on:click="editData(user.user_id)" value="EDIT">
<input type="button" v-on:click="deleteData(user.user_id)" value="DELETE">
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
<select @click="changeSort(sortBy)" v-model="sortBy">
    <option disabled value="">Please select one</option>
    <option value="first_name">First Name</option>
    <option value="last_name">Last Name</option>
    <option value="dob">Date of Birth</option>
    <option value="mobile_number">Mobile Number</option>
    <option value="address">Address</option>
</select>

<br/>
<h3>Choose direction of order</h3>
<select @click="changeDirection(direction)" v-model="direction">
    <option disabled value="">Please select one</option>
    <option value="ASC">Ascending</option>
    <option value="DESC">Descending</option>
</select>

</div>
</div>
<br/>
<input id="new-user" type="button" v-on:click="createNewUser" value="CREATE NEW USER"/>
<div id="pagination">
    <input class="button-style" type="button" value="PREVIOUS" @click="changePage('prev')"/>
    <span class="button-style">{{ page }}</span>
    <input class="button-style" type="button" value="NEXT" @click="changePage('next')"/> <!--string passed as avariable -->
</div>
</div>
</template>
<script>
 import axios from 'axios';
export default {
   
name: 'DisplayTable',
data(){
    return {
        page: 1,
        display_value: [],
        search: '',
        lastSearch: '',
        limit: 5,
        sortBy: '',
        direction: ''
    };
},
methods:{
    changeDirection(value){
        if(value=='AES') {
            this.direction= "AES"
        }
        if(value=='DESC') {
            this.direction= "DESC"
        }
        this.onSearch();
    },
    changeSort(value){
        if (value=='first_name'){
            this.sortBy="first_name";
        }
        if (value=='last_name'){
            this.sortBy="last_name";
        }
        if (value=='dob'){
            this.sortBy="dob";
        }
        if (value=='mobile_number'){
            this.sortBy="mobile_number";
        }
        if (value=='address'){
            this.sortBy="address";
        }
        this.onSearch();
    },
    async fetchUser(){
        let url,params;
        try{
            if(this.search && this.search.trim() !== ""){
            url='http://localhost:8080/api/users/filterUser';
            params={search:this.search,page:this.page,limit:this.limit,sortBy:this.sortBy,direction:this.direction};
        } else {
            url = 'http://localhost:8080/api/users/getAllUsers';
            params={page:this.page,limit:this.limit,sortBy:this.sortBy,direction:this.direction};
        }
        const result = await axios.get(url,{params})
        this.display_value=result.data.users;
        } catch(error) {
            console.log(error);
        }
        
    },
    changePage(value){
        if(value == 'prev' && this.page>1){
            --this.page
            console.log(this.page)
        }
        if(value=='next'){
            ++this.page
            console.log(this.page)
        }
        this.onSearch();
    },
    async onSearch(){
        if(this.search.trim() !== this.lastSearch){
            this.page = 1;
        }
        this.lastSearch=this.search.trim()
        await this.fetchUser();
        
    },
    createNewUser(){
        this.$router.push('/')
    },
    editData(user_id){
        this.$router.push(`/edit/${user_id}`);
    },
    async deleteData(user_id){
        try{
            const result = await axios.delete(`http://localhost:8080/api/users/deleteUser/${user_id}`)
            console.log(result)
            console.log(result.data)
            console.log(result.data.users)
             this.display_value= result.data.users;
        } catch(error){
            console.log("error in data deletion",error)
        }
    
    }
},
async mounted(){
    await this.fetchUser();

}
}
</script>
<style scoped>
h1{
    color: black;
    text-align: center;
}
table, tr, td, th {
    border: 2px black solid;
    
}
table td{
    font-size: 14px;
    padding:2vh;
}
table th{
    color: blue;
    font-weight: bold;
    font-size: 18px;
    padding: 2vh;
}
#table {
    display: flex;
    justify-content: center;
}
input[type=button], table tr td input{
    padding: 1vh;
   margin-left:1vh;
    color:white;
    background-color: black;

}
#new-user{
    margin-left: 11%;
}
#search-embedded{
    border: solid black 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2%;
    height:15%;
    padding: 0.5%;
    border-radius: 2%;
    padding-left: 1%;
    width: 25%;
    margin-left: 36%;
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
    margin-left:9.4%;
    margin-right:15%;
}
#pagination{
    padding: 2%;
   
 }
#pagination span{
    padding: 0.5%;
    padding-left: 3%;
    padding-right: 3%;
   margin-left:7%;
    color:white;
    background-color: black;
}
#sorting {
    margin: 3%;
}
select {
    border: solid black 1px;
    height: 10%;
    width: 79%;
    padding: 0.5%;
}
</style>