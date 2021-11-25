import React, { useEffect, useState } from 'react';
import AddTaskForm from '../components/add-task-form/add-task-form';
import EmptyTaskList from '../components/task-list/empty-list-alert';
import TaskList from '../components/task-list/task-list';
import { get, submit } from '../lib/http';
import { LanguageContext } from '../lib/language';
import { NewTask, Task } from '../lib/task';

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[] | null>(null);

    useEffect(
        () => {
            get('/tasks')
                .then(tasks => setTasks(tasks));
        },
        []
    );

    const handleAddTask = async (newTask: NewTask) => {
        setTasks(await submit('/tasks', 'POST', newTask));
    };

    const handleCompleteTask = async (taskId: string) => setTasks(
        await submit('/tasks/completed', 'POST', {
            completedTasks: [taskId]
        })
    );

    return (
        <LanguageContext.Provider value={navigator.language}>
            {(tasks === null) ? null :
                (tasks.length === 0) ?
                    <EmptyTaskList text="All done!" /> :
                    <TaskList tasks={tasks} onCompleteTask={handleCompleteTask} />
            }
            <AddTaskForm onAddTask={handleAddTask} />
        </LanguageContext.Provider>
    );
};

export default Tasks;