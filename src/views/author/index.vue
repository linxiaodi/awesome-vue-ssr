<template>
	<div>
		<h2>作者:{{ author.name }}</h2>
		<p>{{ author.summary }}</p>
		<p>{{ author.evaluate }}</p>
	</div>
</template>

<script>
export default {
	name: 'author',
	computed: {
		author() {
			return this.$store.state.author
		}
	},
	async asyncData({ store, route }) {
		await store.dispatch('FETCH_AUTHOR')
	}
};
</script>

<style scoped>

</style>
