vcl 4.0;

backend default {
    .host = "phototheque-web-service";  # le Service Kubernetes de ton app Node
    .port = "3003";
}

sub vcl_recv {
    # On peut définir des règles de cache ici
    if (req.url ~ "^/api/") {
        return (pass); # ne pas mettre en cache l’API
    }
}

sub vcl_backend_response {
    set beresp.ttl = 60s; # cache pendant 60 secondes
}
