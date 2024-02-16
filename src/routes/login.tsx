import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import { showToast } from "~/components/ui/toast";

export default function Signup() {
  const [empty, setEmpty] = createStore({ username: false, password: false });
  const [fields, setFields] = createStore({ username: "", password: "", confirm: "" });
  const [incorrect, setIncorrect] = createSignal(false);

  const login = async () => {
    let error = false;

    if (fields.username == "") {
      setEmpty("username", true);
      error = true;
    }

    if (fields.password == "") {
      setEmpty("password", true);
      error = true;
    }

    if (error) return;

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username: fields.username, password: fields.password })
    });

    if (res.status === 401) { 
      setIncorrect(true);
      return;
    }

    if (!res.ok) return;
    
    showToast({ title: `Welcome ${fields.username}!`, description: "Going to overview..." });
    const token = await res.text();
    localStorage.setItem("token", token);
  }

  const set = (field: "username" | "password", value: string) => { 
    setFields(field, value); 
    setEmpty(field, false); 
  };

  return (
    <main class="p-16">
      <Card class="mx-auto my-16 max-w-[320px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Label for="username">Username</Label>
          <Input onInput={(e) => set("username", e.target.value)} type="username" id="username" placeholder="Username" autocomplete="username" />
          {empty.username ? <p class="text-red-500">Cannot be empty</p> : <></>}
          {incorrect() ? <p class="text-red-500">Incorrect username or password</p> : <></>}

          <br />
          
          <Label for="password">Password</Label>
          <Input onInput={(e) => set("password", e.target.value)} type="password" id="password" placeholder="Password" autocomplete="new-password" />
          {empty.password ? <p class="text-red-500">Cannot be empty</p> : <></>}
          {incorrect() ? <p class="text-red-500">Incorrect username or password</p> : <></>}
        </CardContent>
        <CardFooter>
          <Button onClick={() => login()} class="w-full" type="submit">Login</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
