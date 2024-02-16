import { A } from "@solidjs/router";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import { showToast } from "~/components/ui/toast";

export default function Signup() {
  const [empty, setEmpty] = createStore({ username: false, password: false, confirm: false });
  const [mismatch, setMismatch] = createSignal(false);
  const [taken, setTaken] = createSignal(false);
  const [fields, setFields] = createStore({ username: "", password: "", confirm: "" });

  const signup = async () => {
    let error = false;
    if (fields.username == "") {
      setEmpty("username", true);
      error = true;
    }

    if (fields.password == "") {
      setEmpty("password", true);
      error = true;
    }

    if (fields.confirm == "") {
      setEmpty("confirm", true);
      error = true;
    }

    if (fields.password != fields.confirm) {
      setMismatch(true);
      error = true;
    }

    if (error) return;

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ username: fields.username, password: fields.password })
    });

    if (res.status === 409) {
      setTaken(true);
      return;
    }

    if (!res.ok) return;

    showToast({ title: `Welcome ${fields.username}!`, description: "Going to overview..." });

    const token = await res.text();
    localStorage.setItem("token", token);
  }

  const set = (field: "username" | "password" | "confirm", value: string) => { 
    setFields(field, value); 
    setEmpty(field, false); 
    if (field === "username") { setTaken(false); } 
  };

  return (
    <main class="p-16">
      <Card class="mx-auto my-16 max-w-[320px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Label for="username">Username</Label>
          <Input onInput={(e) => set("username", e.target.value)} type="username" id="username" placeholder="Username" autocomplete="username" />
          {empty.username ? <p class="text-red-500">Cannot be empty</p> : <></>}
          {taken() ? <p class="text-red-500">Username taken</p> : <></>}
          <br />
          <Label for="password">Password</Label>
          <Input onInput={(e) => set("password", e.target.value)} type="password" id="password" placeholder="Password" autocomplete="new-password" />
          {empty.password ? <p class="text-red-500">Cannot be empty</p> : <></>}
          <br />
          <Label for="confirm">Confirm Password</Label>
          <Input onInput={(e) => set("confirm", e.target.value)} type="password" id="confirm" placeholder="Confirm Password" autocomplete="new-password" />
          {empty.confirm ? <p class="text-red-500">Cannot be empty</p> : <></>}
          {mismatch() ? <p class="text-red-500">Passwords do not match</p> : <></>}
        </CardContent>
        <CardFooter>
          <Button onClick={() => signup()} class="w-full" type="submit">Sign Up</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
