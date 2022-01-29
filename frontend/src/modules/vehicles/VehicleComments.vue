<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow class="justify-content-between ml-0 mr-0">
          <h4>Comments - ({{ commentsCount }})</h4>
          <CButton color="primary" @click="writingComment = true" v-if="!writingComment">
            <CIcon name="cil-pen"/>
            &nbsp;&nbsp;Write a comment
          </CButton>
        </CRow>
        <CCollapse :show="writingComment" :duration="400" class="mt-3">
          <CCol>
            <!-- <CTextarea
              placeholder="New comment"
              rows="5"
              v-model="newComment"
            /> -->
            <quill-editor v-model="newComment" class="mb-3 mt-3"/>
            <CButton color="danger" class="mr-2" @click="writingComment = false">Cancel</CButton>
            <CButton color="success" @click="createNewComment">Post</CButton>
          </CCol>
        </CCollapse>
        <hr />
        <CCol v-if="comments.length > 0">
          <div class="pt-2" v-for="(comment, index) in comments" :key="comment._id">
            <CRow class="ml-0 mr-0 d-flex justify-content-between">
              <h6>{{ comment.author.first_name }}&nbsp;{{ comment.author.last_name }}</h6>
              <p><small>{{ comment.timestamp }}</small></p>
            </CRow>
            <div v-html="comment.comment">
              {{ comment.comment }}
            </div>
            <CRow class="ml-0 mr-0 d-flex justify-content-end" v-if="comment.author._id == $store.state.auth.userId">
              <CIcon name="cil-trash" class="mr-2 trash-comment-btn" @click.native="deleteComment(comment, index)"/>
            </CRow>
            <hr />
          </div>
        </CCol>
      </CCardBody>
    </CCard>
    <CModal :show.sync="deletingComment" :centered="true">
      <p>
        Are you sure you want to delete this comment? Others in the dealership 
        will no longer be able to see what you had written.
      </p>
      <template #header>
        <h6 class="modal-title">Delete comment?</h6>
        <CButtonClose
          @click="
            () => {
              deletingComment = false;
              commentBeingDeleted = null;
              indexBeingDeleted = null;
            }
          "
        />
      </template>
      <template #footer>
        <CButton @click="() => { 
          deletingComment = false;
          commentBeingDeleted = null;
          indexBeingDeleted = null;
        }" color="secondary"
          >Cancel</CButton
        >
        <CButton @click="deleteVehicleComment" color="danger">Confirm</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
const axios = require('axios');
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

export default {
  props: ['vehicle'],
  data() {
    return {
      comments: [],
      commentsCount: 0,
      writingComment: false,
      deletingComment: false,
      commentBeingDeleted: false,
      indexBeingDeleted: null,
      newComment: ''
    }
  },
  methods: {
    fetchVehicleComments() {
      axios({
        method: "GET",
        url: `${this.$store.state.api}/comments/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          this.comments = response.data.payload;
          this.commentsCount = response.data.count;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postVehicleComment(body) {
      axios({
        method: "POST",
        url: `${this.$store.state.api}/comments/vehicle/${this.vehicle._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
        data: body
      })
        .then((response) => {
          console.log(response.data.payload);
          this.comments.unshift(response.data.payload)
          this.newComment = '';
          this.writingComment = false;
          this.commentsCount++;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteVehicleComment() {

      axios({
        method: "DELETE",
        url: `${this.$store.state.api}/comments/comment/${this.commentBeingDeleted._id}`,
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`,
        },
      })
        .then((response) => {
          this.comments.splice(this.indexBeingDeleted, 1);
          this.commentBeingDeleted = null;
          this.indexBeingDeleted = null;
          this.deletingComment = false;
          this.commentsCount = this.commentsCount - 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteComment(target, index) {
      console.log(target);
      this.commentBeingDeleted = target;
      this.indexBeingDeleted = index;
      this.deletingComment = true;
    },
    createNewComment() {
      const body = {
        vehicle: this.vehicle._id,
        author: this.$store.state.auth.userId,
        comment: this.newComment
      }

      console.log(this.newComment);

      if (this.newComment == '') {
        // show alert
      } else {
        this.postVehicleComment(body);
      }
    }
  },
  mounted() {
    // fetch the vehicle's comments
    this.fetchVehicleComments();
  }
}
</script>

<style>
.trash-comment-btn:hover {
  color: red;
  cursor: pointer;
}
</style>