import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('removeTask', (index) => this.removeTask(index));
    this.socket.on('addTask', (taskName) => this.addTask(taskName));
    this.socket.on('updateTask', (tasks) => this.updateTask(tasks));
  }
  removeTask = (index) => {
    const { tasks } = this.state;
    const tasksList = tasks.filter((task) => tasks.indexOf(task) == !index);
    this.setState({
      tasks: tasksList,
    });
  };
  handleRemoveTask(index) {
    this.removeTask(index);
    this.socket.emit('removeTask', index);
  }

  handleChange(event) {
    this.setState({
      taskName: event.target.value,
    });
  }
  addTask(task) {
    const { tasks } = this.state;
    this.setState({
      tasks: [...tasks, task],
      taskName: '',
    });
  }
  submitForm(event) {
    const { taskName } = this.state;
    event.preventDefault();
    this.addTask(taskName);
    this.socket.emit('addTask', taskName);
  }
  updateTask(updatedTasks) {
    this.setState({
      tasks: updatedTasks,
    });
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks === undefined || tasks.length < 1
              ? ''
              : tasks.map((task) => (
                  <li kay={tasks.indexOf(task)} className='task'>
                    {task}
                    <button
                      className='btn btn--red'
                      onClick={() => this.handleRemoveTask(tasks.indexOf(task))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
          </ul>

          <form id='add-task-form' onSubmit={(event) => this.submitForm(event)}>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              value={taskName}
              onChange={(event) => this.handleChange(event)}
            />
            <button className='btn' type='submit'>
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
