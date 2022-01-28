<template>
  <td> {{value}} </td>
</template>

<script>
export default {
    props: ['item', 'field'],
    computed: {
        value() {
            if (this.field.inputType == 'List') {
                let list = this.item.item[this.field.key];
                let value = '';
                for (let i = 0; i < list.length; i++) {
                    if (i < list.length - 1) {
                        value = value + list[i] + ', ';
                    } else {
                        value = value + list[i];
                    }
                }
                return value;
            } 
            
            else {
                return this.item.item[this.field.key];
            }
        }
    }
}
</script>

<style>

</style>