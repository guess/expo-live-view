defmodule DemoWeb.UserFormChannel do
  use LiveViewModel.Channel, web_module: DemoWeb

  alias Demo.User

  def init(_channel, _payload, _socket) do
    {:ok, %{is_connected: true}}
  end

  def handle_event("validate", %{"user" => params}, state) do
    changeset = User.changeset(%User{}, params) |> Map.put(:action, :validate)
    {:noreply, state |> Map.put(:form, to_form(changeset))}
  end

  def to_form(%Ecto.Changeset{} = changeset) do
    %{
      data: Map.merge(changeset.params, changes_for(changeset)),
      errors: errors_as_map(changeset)
    }
  end

  @spec errors_as_map(Ecto.Changeset.t()) :: %{atom() => list(binary())}
  defp errors_as_map(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts
        |> Keyword.get(String.to_atom(key), key)
        |> to_string()
      end)
    end)
  end

  defp changes_for(%Ecto.Changeset{} = changeset) do
    changeset.changes
    |> Enum.map(fn {k, v} -> {to_string(k), changes_for(v)} end)
    |> Enum.into(%{})
  end

  defp changes_for(changes), do: changes
end
