import React, { useState, useEffect, useRef } from "react";
import { FiSun, FiMoon, FiCheck, FiX, FiTrash } from "react-icons/fi";
import {
  Button,
  useColorMode,
  Container,
  Flex,
  Input,
  Heading,
  Text,
  Box,
  Fade,
  SlideFade,
} from "@chakra-ui/react";

interface ITask {
  name?: string;
  done?: boolean;
}

type FormElement = React.FormEvent<HTMLFormElement>;

function App(): JSX.Element {
  // State
  const [newTask, setNewTask] = useState<string>("");
  const [tasks, setTasks] = useState<ITask[]>([]);

  // Ref
  const taskInput = useRef<HTMLInputElement>(null);

  const { colorMode, toggleColorMode } = useColorMode();

  const handleSetTasks = (newTasks: ITask[]): void => {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // Add task
  const handleSubmit = (e: FormElement): void => {
    e.preventDefault();
    if (newTask) addTask(newTask);
  };

  const addTask = (name: string): void => {
    // Add task
    const newTasks = [...tasks, { name, done: false }];
    handleSetTasks(newTasks);

    // Clean input
    setNewTask("");
    taskInput.current?.focus();
  };

  // Update done of task
  const toggleDoneTask = (i: number): void => {
    const newTasks: ITask[] = [...tasks];
    newTasks[i].done = !newTasks[i].done;
    handleSetTasks(newTasks);
  };

  // Delete Tasks
  const deleteTask = (i: number): void => {
    const newTasks: ITask[] = [...tasks];
    newTasks.splice(i, 1);
    handleSetTasks(newTasks);
  };

  // Get tasks of LocalStorage
  const getTasks = (): void => {
    const tasksLS = localStorage.getItem("tasks");
    let newTasks: ITask[] = [];

    if (typeof tasksLS === "string") {
      newTasks = JSON.parse(tasksLS) || [];
    }

    setTasks(newTasks);
  };

  useEffect((): void => {
    getTasks();
  }, []);

  return (
    <Container maxW="xl">
      <Flex w="100%" justify="flex-end" mb={5}>
        <Button colorScheme="gray" onClick={toggleColorMode} mt={5}>
          Modo
          {colorMode === "light" ? (
            <FiMoon style={{ marginLeft: 4 }} />
          ) : (
            <FiSun style={{ marginLeft: 4 }} />
          )}
        </Button>
      </Flex>

      <Fade in>
        <form onSubmit={handleSubmit}>
          <Heading as="h1" mb={4}>
            Nueva tarea
          </Heading>
          <Input
            type="text"
            placeholder="Nueva tarea"
            isRequired
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            ref={taskInput}
          />
          <Button colorScheme="blue" type="submit" mt={5} disabled={!newTask}>
            Guardar
          </Button>
        </form>
      </Fade>

      <Box w="90%" m="0 auto" mt={4} mb={4}>
        {tasks.map((t: ITask, i: number) => (
          <SlideFade key={i} in offsetY={20}>
            <Box
              w="100%"
              bg={colorMode === "dark" ? "#373e51" : "#cdd8f5"}
              p={4}
              mb={4}
              borderRadius={5}
            >
              <Flex align="center" justify="space-between" w="100%">
                <Text
                  style={{ textDecoration: t.done ? "line-through" : "" }}
                  w="50%"
                >
                  {t.name}
                </Text>
                <Flex align="center">
                  <Button onClick={(): void => toggleDoneTask(i)}>
                    {t.done ? <FiX /> : <FiCheck />}
                  </Button>
                  <Button onClick={(): void => deleteTask(i)} ml={2}>
                    <FiTrash />
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </SlideFade>
        ))}
      </Box>
    </Container>
  );
}

export default App;
