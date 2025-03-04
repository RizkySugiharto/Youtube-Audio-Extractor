<template>
    <div class="">
        <div class="header">
            <h1 class="k2d-extrabold">Youtube Audio Extractor</h1>
        </div>
        <div class="content">
            <form @submit="submit">
                <label class="k2d-semibold">Youtube Video URL:</label><br>
                <input type="text" name="videoUrl" autocomplete="off">
                <input type="submit" name="submit" value="Extract" @click="extract">
                <input type="submit" name="submit" value="Check" @click="check">
                <p v-if="loading" class="k2d-medium">Please wait....</p>
            </form>
            <main v-if="displayStatus === 'Extract'">
                <img ref="videoThumbnail" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShhaKckoGwx48DVxoVZUCFNhvh3gJmh1MDlA&s">
                <div>
                    <p ref="videoTitle">[Video Title]</p>
                    <p ref="videoAuthor">[Video Author]</p>
                    <p ref="videoUploadDate">[Video Upload Date]</p>
                    <a :href="downloadUrl" target="_blank"><button>Download</button></a>
                </div>
            </main>
            <p class="k2d-extrabold" v-else-if="displayStatus === 'Check'">{{ checkMessage }}</p>
        </div>
    </div>
</template>

<script>
import utils from "@/utils/index"

export default {
    name: 'App',
    data() {
        return {
            displayStatus: '',
            checkMessage: '',
            downloadUrl: '',
            loading: false
        }
    },
    methods: {
        async submit(e) {
            e.preventDefault()
            const api = utils.getApi()
            const videoUrl = e.target[0].value

            if (!videoUrl) return
            this.displayStatus = e.submitter.value

            this.loading = true
            if (this.displayStatus === 'Check') {
                const response = await api.get(`/check?url=${videoUrl}`)
                if (!response.data || this.displayStatus != 'Check') return
                
                this.checkMessage = response.data.isValid ?
                    'This url is available to extract :)' :
                    'This url is unavailable to extract :('
            } else if (this.displayStatus == 'Extract') {
                const isValid = (await api.get(`/check?url=${videoUrl}`)).data.isValid
                if (!isValid || this.displayStatus != 'Extract') {
                    this.displayStatus = 'Check'
                    this.checkMessage = 'This url is unavailable to extract :('
                    return
                }

                this.$refs.videoThumbnail.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShhaKckoGwx48DVxoVZUCFNhvh3gJmh1MDlA&s'
                this.$refs.videoTitle.innerText = '[Video Title]'
                this.$refs.videoAuthor.innerText = '[Video Author]'
                this.$refs.videoUploadDate.innerText = '[Video Upload Date]'

                const response = await api.get(`/extract?url=${videoUrl}`)
                if (!response.data || this.displayStatus != 'Extract') return

                const uploadDate = new Date(response.data.upload_date)

                this.$refs.videoThumbnail.src = response.data.thumbnail_url
                this.$refs.videoTitle.innerText = response.data.title
                this.$refs.videoAuthor.innerText = response.data.author
                this.$refs.videoUploadDate.innerText = uploadDate.toDateString()
                this.downloadUrl = `${api.getUri()}/download?url=${videoUrl}`
            }
            this.loading = false
        }
    }
}
</script>
  