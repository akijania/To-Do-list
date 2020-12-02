import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('removeTask', (taskId) => this.removeTask(taskId));
    this.socket.on('updateTask', (tasks) => this.updateTask(tasks));
  }
  removeTask = (taskId) => {
    const { tasks } = this.state;
    const tasksList = tasks.filter(task => task.id !== taskId );
    this.setState({
      tasks: tasksList,
    });
  };
  handleRemoveTask(taskId) {
    this.removeTask(taskId);
    this.socket.emit('removeTask', taskId);
  }

  handleChange(event) {
    this.setState({
      taskName: event.target.value,
    });
  }
  addTask(taskId, taskName) {
    const { tasks } = this.state;
    this.setState({
      tasks: [...tasks, { id: taskId, name: taskName }],
      taskName: '',
    });
  }
  submitForm(event) {
    const { taskName } = this.state;
    const taskId = uuidv4();
    event.preventDefault();
    this.addTask(taskId, taskName);
    this.socket.emit('addTask', { id: taskId, name: taskName });
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
                  <li key={task.id} className='task'>
                    {task.name}
                    <button
                      className='btn btn--red'
                      onClick={() => this.handleRemoveTask(task.id)}
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
