<template>
  <q-page class="flex flex-center column background" padding>
    <!--img src="logo/hiclipart.com.png" class="logologin" alt="logo"-->
    <q-card class="bg-negative text-white q-mb-md" v-if="displayError">
      <q-card-section>
        <div class="text-h6">Error d'autenticació</div>
      </q-card-section>
      <q-card-section>El seu nom d'usuari o contrasenya són invàlids.</q-card-section>
    </q-card>

    <br><br>
    <div class="row q-mt-md q-mb-md">
    </div>
    <q-card class="text-black q-mb-md background-card">
      <q-card-section class="flex flex-center column">
        <q-img
          :src="logo"
          :width="'100%'"
          alt="Logo"
        />

        <h3 class="text-center text-black-50">GestSuite</h3>

        <q-btn label="Entra amb Google" @click="loginGoogleDeleteCookies" size="xl" icon="lock" class="q-mb-md" color="primary"/>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.logologin{
  height:150px;
}
.background{
  background: white;
  background-size: cover;
}

.background-card{
  background: rgba(255,255,255,0.9);
}
</style>

<script>

  export default {
    name: 'Login',
    data() {
      return {
        displayError: false,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        logo: process.env.CENTRE_LOGO,
        background: process.env.CENTRE_BACKGROUND
      };
    },
    mounted() {
      let scriptAuth = document.createElement('script')
      scriptAuth.setAttribute('src', 'https://accounts.google.com/gsi/client')
      document.head.appendChild(scriptAuth)

      scriptAuth.onload=async ()=>{
          await this.loginGoogle();
      }

      document.querySelector(".background").style.backgroundImage=`url("${this.background}")`;

    },
    created() {
      localStorage.removeItem("token");
      localStorage.removeItem("rol")

    },
    methods: {
      async loginGoogle(){
        google.accounts.id.initialize({
          client_id: this.googleClientId,
          auto_select: true,
          ux_mode: "popup",
          callback: async (responseGoogle)=>{
            console.log("responseGoogle",responseGoogle)
            const token = responseGoogle.credential;
            const response = await this.$axios.post(process.env.API+'/api/core/auth/google/login', token)
            console.log("response",response)

            if (response && response.data) {
              //Desem primer el token per poder enviar-lo a la petició de rol.
              const tokenData = await response.data;
              localStorage.setItem('token', tokenData);

              const responseRol = await this.$axios.get(process.env.API+'/api/core/auth/profile/rol',{
                method: 'GET',
                headers: {
                  Authorization: tokenData
                }
              })
              const rolData = await responseRol.data
              localStorage.setItem('rol',JSON.stringify(rolData));
              this.displayError = false;

              //Redirect
              this.$router.push('/dashboard');

            } else {
              this.displayError = true;
            }
          }
        });
        google.accounts.id.prompt();
      },
      clearCookies(){
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      },
      async loginGoogleDeleteCookies(){
        this.clearCookies();
        await this.loginGoogle();
      }
    }
  }
</script>
