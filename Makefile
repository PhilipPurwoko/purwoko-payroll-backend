.PHONY: nest-g

nest-g:
	@if [ $(words $(MAKECMDGOALS)) -eq 1 ]; then \
		echo "Usage: make nest-g module_a module_b ..."; \
		exit 1; \
	fi; \
	$(eval modules := $(filter-out $@,$(MAKECMDGOALS))) \
	for mod in $(modules); do \
		echo "Generating resource for $$mod..."; \
		nest g resource $$mod; \
	done

# Prevent Make from interpreting module names as Makefile targets
%:
	@:
