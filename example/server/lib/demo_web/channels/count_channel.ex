defmodule DemoWeb.CountChannel do
  use LiveViewModel.Channel, web_module: DemoWeb

  def init(_channel, _payload, _socket) do
    {:ok, %{count: 5}}
  end

  def handle_event("increment", _params, %{count: count}) do
    {:noreply, %{count: count + 1}}
  end

  def handle_event("decrement", _params, %{count: count}) do
    {:noreply, %{count: count - 1}}
  end
end
