new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            isDark: true,
            show: true,
            todoTitle: '',
            todos: []
        }
    },
    methods: {
        addTodo() {
            const title = this.todoTitle.trim()
            if (!title) {
                return
            }
            fetch('/api/todo', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title})
            })
                .then(res => res.json())
                .then(({todo}) => {
                    this.todos.push(todo)
                    this.todoTitle = ''
                })
                .catch(e => console.error(e))
        },
        removeTodo(id) {
            fetch('/api/todo/' + id, {
                method: 'delete',
            })
                .then(() => {
                    console.log('here we are');
                    this.todos = this.todos.filter(todo => todo.id !== id)
                })
                .catch(e => console.error(e))
        },
        toggleTheme() {
            this.show = !this.show
            this.isDark = !this.isDark
        },
        completeTodo(id) {
            fetch('/api/todo/' + id, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: true })
            })
                .then(res => res.json())
                .then(({ todo }) => {
                    const idx = this.todos.findIndex(_todo => _todo.id === id)
                    this.todos[idx].updatedAt = todo.updatedAt
                })
                .catch(e => console.error(e))
        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }

            if (withTime) {
                options.hour = '2-digit'
                options.minute = '2-digit'
                options.second = '2-digit'
            }

            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
        }
    },
    created() {
        this.$vuetify.theme.dark = this.isDark;
        fetch('/api/todo', {
            method: 'get'
        })
            .then(res => res.json())
            .then(todos => {
                this.todos = todos
            })
            .catch(e => console.error(e))
    },
    watch: {
        isDark: function (val) {
            this.$vuetify.theme.dark = val
        }
    },
})
