@extends('layouts.general')

@section('general_content')
@include('navigation.org_topbar')
<main>
@yield('org_content')	
</main>
@include('navigation.org_bottombar')
@stack('scripts')
@endsection