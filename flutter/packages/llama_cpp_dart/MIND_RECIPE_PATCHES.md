# Mind Recipe compatibility patch

This package is vendored from `llama_cpp_dart` 0.2.2 under its original MIT
license. It is pinned to llama.cpp commit
`4ffc47cb2001e7d523f9ff525335bbe34b1a2858`.

Mind Recipe removes a duplicate `llama_free_model` call when native context
creation fails. The enclosing error handler owns model cleanup, preventing a
double free on Android. It also propagates generation errors through the
per-prompt completion future so the application cannot mistake a failed native
generation for an empty successful response. Native arm64 libraries built from
the matching llama.cpp commit are packaged by the application.

Mind Recipe also exposes the package's existing native clear command through the
parent isolate, allowing bounded mobile turns to reset context without
reloading the model.
