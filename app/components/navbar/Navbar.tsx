import Container from '../Container'


const navbar = () => {
  return (
    <nav className="fixed w-full bg-white z-10 shadow-sm">
        <div className="py-4 border-b">
            <Container></Container>
        </div>
    </nav>
  )
}

export default navbar  