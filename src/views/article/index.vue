<template>
	<div>
		<h3>{{ article.title }}</h3>
		<h5>
			{{ article.author }}
		</h5>
		<p>{{ article.desc }}</p>
	</div>
</template>

<script>
export default {
	name: 'v-article',
	computed: {
		article() {
			return this.$store.state.article
		}
	},
	async asyncData({ store, route }) {
		await store.dispatch('FETCH_ARTICLE')
	}
};
</script>

<style scoped>

</style>
