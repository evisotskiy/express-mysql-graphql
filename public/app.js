/* eslint-disable no-undef */
new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: '',
      todos: [],
    };
  },
  methods: {
    getTodos() {
      const query = /* GraphQL */ `
        query {
          getTodos {
            id
            title
            done
            createdAt
            updatedAt
          }
        }
      `;
      fetch('/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then(({ data: { getTodos } }) => {
          this.todos = getTodos;
        })
        .catch((e) => console.error(e));
    },
    addTodo() {
      const title = this.todoTitle.trim();
      if (!title) {
        return;
      }

      const query = /* GraphQL */ `
        mutation {
          createTodo(todo: {title: "${title}"}) {
            id title done createdAt updatedAt
          }
        }
      `;

      fetch('/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then(({ data: { createTodo: todo } }) => {
          this.todos.push(todo);
          this.todoTitle = '';
        })
        .catch((e) => console.error(e));
    },
    completeTodo(id) {
      const query = /* GraphQL */ `
        mutation {
          completeTodo(id: "${id}") {
            updatedAt
          }
        }
      `;
      fetch('/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then(
          ({
            data: {
              completeTodo: { updatedAt },
            },
          }) => {
            const idx = this.todos.findIndex((_todo) => _todo.id === id);
            this.todos[idx].updatedAt = updatedAt;
          },
        )
        .catch((e) => console.error(e));
    },
    removeTodo(id) {
      const query = /* GraphQL */ `
        mutation {
          deleteTodo(id: "${id}")
        }
      `;

      fetch('/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then(() => {
          this.todos = this.todos.filter((todo) => todo.id !== id);
        })
        .catch((e) => console.error(e));
    },
    toggleTheme() {
      this.show = !this.show;
      this.isDark = !this.isDark;
    },
  },
  filters: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1);
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      };

      if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
      }

      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value));
    },
  },
  created() {
    this.$vuetify.theme.dark = this.isDark;
    this.getTodos();
  },
  watch: {
    isDark: function (val) {
      this.$vuetify.theme.dark = val;
    },
  },
});
