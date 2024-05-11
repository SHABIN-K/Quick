import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Ready to Quick chat?
      </h2>
      <AuthForm />
    </>
  );
}
