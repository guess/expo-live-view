defmodule DemoWeb.Socket do
  use Phoenix.Socket

  channel("count", DemoWeb.CountChannel)

  @impl true
  def connect(_params, socket), do: {:ok, socket}

  @impl true
  def id(_), do: "random_id"
end
