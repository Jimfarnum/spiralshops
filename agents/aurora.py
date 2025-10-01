from autogen import AssistantAgent

Aurora = AssistantAgent(
    name="Aurora",
    system_message="Aurora is the SPIRAL Shopper Product Search Agent. She finds products, filters, and recommends using RAG."
)

def identify_problem(query):
    return f"Shopper is searching for: {query}"

def propose_solution(query):
    return f"Aurora retrieves matching products for: {query}"

def collaborate(agent, query):
    return agent.receive_message(f"Aurora found results for: {query}")

def execute(query):
    return propose_solution(query)